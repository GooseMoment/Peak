import { useState, useEffect, useRef } from "react"

import styled, { css } from "styled-components"

import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button"

const DragAndDownBox = ({ task, children }) => {
    const ref = useRef(null)
    const dragHandleRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [closestEdge, setClosestEdge] = useState(null)

    useEffect(() => {
        const element = ref.current
        const dragHandle = dragHandleRef.current
        
        const cleanupDraggable = draggable({
            element: dragHandle,
            getInitialData: () => ({ order: task.order, id: task.id }),
            onDragStart() {
                setIsDragging(true)
            },
            onDrop() {
                setIsDragging(false)
            }
        })

        const cleanupDropTarget = dropTargetForElements({
            element,
            canDrop({ source }) {
                return source.data.id !== task.id
            },
            getData({ input }) {
                return attachClosestEdge({ order: task.order, id: task.id }, {
                    element,
                    input,
                    allowedEdges: ['top', 'bottom'],
                })
            },
            onDrag({ location, source }) {
                const isSource = source.element === element

                if (isSource) {
                    setClosestEdge(null)
                    return
                }

                const sourceOrder = source.data.order
                if (typeof(sourceOrder) !== 'number')
                    return

                const targetData = location.current.dropTargets[0]?.data

                if (targetData) {
                    const symbolProperties = Object.getOwnPropertySymbols(targetData)
                    const closestEdge = targetData[symbolProperties[0]]
                    setClosestEdge(closestEdge)
                }
            },
            onDragLeave() {
                setClosestEdge(null)
            },
            onDrop() {
                setClosestEdge(null)
            }
        })

        return () => {
            cleanupDraggable()
            cleanupDropTarget()
        }
    }, [task.order, task.id])

    return (
        <DragAndDownBlock $edge={closestEdge}>
            <DragHandleButtonBox>
                <DragHandleButton ref={dragHandleRef}/>
            </DragHandleButtonBox>
            <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} >
                {children}
            </div>
        </DragAndDownBlock>
    )
}

const DragHandleButtonBox = styled.div`
    visibility: hidden;
    margin-bottom: 0.26em;
    margin-right: 0.2em;

    & button {
        background-color: ${p=>p.theme.backgroundColor};
    }

    & span {
        color: ${p=>p.theme.textColor};
    }
`

const DragAndDownBlock = styled.div`
    display: flex;
    align-items: center;
    border-top: 2px solid transparent;
    border-bottom: 2px solid transparent;

    ${props => props.$edge && props.$edge === "top" ? css`
        border-top: 2px dashed ${p=>p.theme.goose};
    ` : props.$edge === "bottom" && css`
        border-bottom: 2px dashed ${p=>p.theme.goose};
    `}

    &:hover {
        ${DragHandleButtonBox} {
            visibility: visible;
        }
    }
`

export default DragAndDownBox
