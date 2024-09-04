import { useState, useEffect, useRef } from "react"

import styled, { css } from "styled-components"

import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button"
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box"

const DragAndDownBox = ({ task, children }) => {
    const ref = useRef(null)
    const dragHandleRef = useRef(null)

    const [closestEdge, setClosestEdge] = useState(null)

    useEffect(() => {
        const element = ref.current
        const dragHandle = dragHandleRef.current
        
        const cleanupDraggable = draggable({
            element: dragHandle,
            getInitialData: () => ({ order: task.order, id: task.id }),
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
            onDrag({ self, source }) {
                const isSource = source.element === element

                if (isSource) {
                    setClosestEdge(null)
                    return
                }

                const closestEdge = extractClosestEdge(self.data)

                const sourceOrder = source.data.order
                if (typeof(sourceOrder) !== 'number')
                    return

                setClosestEdge(closestEdge)
            },
            onDragLeave() {
                setClosestEdge(null)
            },
            onDrop() {
                setClosestEdge(null)
            },
        })

        return () => {
            cleanupDraggable()
            cleanupDropTarget()
        }
    }, [task.order, task.id])

    return (
        <>
            <DragAndDownBlock $edge={closestEdge}>
                <DragHandleButtonBox>
                    <DragHandleButton ref={dragHandleRef}/>
                </DragHandleButtonBox>
                <div ref={ref}>
                    {children}
                </div>
            </DragAndDownBlock>
            {closestEdge && <DropIndicator edge={closestEdge} gap="1px" />}
        </>
    )
}

const DragHandleButtonBox = styled.div`
    visibility: hidden;
    margin-top: 1.2em;
    margin-right: 0.2em;

    & button {
        background-color: white;
    }

    & span {
        color: black;
    }
`

const DragAndDownBlock = styled.div`
    display: flex;
    align-items: center;
    border-top: 1px solid transparent;

    ${props => props.$edge && props.$edge === "top" && css`
        border-top: 2px dotted ${p=>p.theme.goose};
    `}

    &:hover {
        ${DragHandleButtonBox} {
            visibility: visible;
        }
    }
`

export default DragAndDownBox
