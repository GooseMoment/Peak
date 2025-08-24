import { useEffect, useMemo, useState } from "react"

import styled from "styled-components"

const DURATION = 180

export default function AnimatedCount({
    count,
    selected,
}: {
    count: number
    selected?: boolean
}) {
    const [prev, setPrev] = useState(count)
    const [dir, setDir] = useState<"up" | "down" | null>(null)
    const timerRef = useMemo<{ id: number | null }>(() => ({ id: null }), [])

    useEffect(() => {
        if (count === prev) {
            return
        }

        if (timerRef.id) {
            clearTimeout(timerRef.id)
            timerRef.id = null
        }
        setDir(count < prev ? "up" : "down")
        timerRef.id = window.setTimeout(() => {
            setPrev(count)
            setDir(null)
            timerRef.id = null
        }, DURATION)

        return () => {
            if (timerRef.id) {
                clearTimeout(timerRef.id)
            }
        }
    }, [count, prev, timerRef])

    return (
        <Wrapper $selected={selected} aria-live="polite" aria-atomic>
            <StaticNum $hidden={!!dir}>{prev}</StaticNum>
            {dir && (
                <>
                    <MovingOut $dir={dir}>{prev}</MovingOut>
                    <MovingIn $dir={dir}>{count}</MovingIn>
                </>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.span<{ $selected?: boolean }>`
    position: relative;
    display: inline-block;
    height: 1em;
    line-height: 1em;
    overflow: hidden;

    & span {
        font-weight: 600;
        min-width: 0.9em;
        text-align: right;

        color: ${(p) =>
            p.$selected ? p.theme.social.activeColor : p.theme.textColor};

        transition: color 0.1s ease;
    }
`

const StaticNum = styled.span<{ $hidden?: boolean }>`
    visibility: ${(p) => (p.$hidden ? "hidden" : "visible")};
    display: inline-block;
`

const MovingOut = styled.span<{ $dir: "up" | "down" }>`
    position: absolute;
    inset: 0;
    animation: ${(p) => (p.$dir === "up" ? "count-out-up" : "count-out-down")}
        ${DURATION}ms ease forwards;

    @keyframes count-out-up {
        from {
            transform: translateY(0%);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
    @keyframes count-out-down {
        from {
            transform: translateY(0%);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`

const MovingIn = styled.span<{ $dir: "up" | "down" }>`
    position: absolute;
    inset: 0;
    animation: ${(p) => (p.$dir === "up" ? "count-in-up" : "count-in-down")}
        ${DURATION}ms ease forwards;

    @keyframes count-in-up {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0%);
            opacity: 1;
        }
    }
    @keyframes count-in-down {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0%);
            opacity: 1;
        }
    }
`
