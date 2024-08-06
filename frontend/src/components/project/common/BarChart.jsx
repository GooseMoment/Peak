import styled from "styled-components"

const BarChart = ({ project, drawers }) => {
    const projectTaskCount = project.completed_task_count + project.uncompleted_task_count
    
    const isCompleted = () => {
        if (projectTaskCount === 0)
            return false
        
        let totalUncompletedTaskCount = 0;
        for (let i=0; i<drawers.length; i++) {
            totalUncompletedTaskCount += drawers[i].uncompleted_task_count
        }
        if (totalUncompletedTaskCount)
            return false
        else
            return true
    }

    const calculatePercent = (completed_task_count) => {
        if (projectTaskCount === 0)
            return 0

        let calculated = Math.floor(completed_task_count / projectTaskCount * 100)

        if (isNaN(calculated))
            return 0
        return calculated
    }

    return (
        <BarChartBox>
            {isCompleted() ? <BarData $percent={100} $color={project.color}>
                <PercentText>100%</PercentText>
            </BarData> :
            drawers?.map(drawer=>(
                <BarData 
                    key={drawer.id} 
                    $percent={calculatePercent(drawer.completed_task_count)} 
                    $color={project.color}
                >
                    <PercentText>{drawer.name}</PercentText>
                    <PercentText>{calculatePercent(drawer.completed_task_count)}%</PercentText>
                </BarData>
            ))}
        </BarChartBox>
    )
}

const BarChartBox = styled.div`
    display: flex;
    height: 3em;
    overflow: hidden;
    background-color: ${p=>p.theme.grey};
    border-radius: 15px;
    margin: 3em 0em;
    gap: 0.1em;
`

const PercentText = styled.div`
    visibility: hidden;
    color: ${p=>p.theme.white};
    font-size: 0.9em;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const BarData = styled.div`
    display: ${props=>props.$percent === 0 ? 'none' : 'flex'};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${props=>props.$percent}%;
    background-color: #${props=>props.$color};
    gap: 0.1em;
    cursor: pointer;

    &:hover {
        opacity: 0.8;

        ${PercentText} {
            visibility: visible;
        }
    }
`

export default BarChart