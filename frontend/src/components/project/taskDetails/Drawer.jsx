import { useQuery } from "@tanstack/react-query"

import Detail from "@components/project/common/Detail"
import DrawerFolder from "@components/project/Creates/DrawerFolder"
import { getProjectList } from "@api/projects.api"

const Drawer = ({ setFunc, closeComponent }) => {
    const { isPending, isError, data: projects, error } = useQuery({
        queryKey: ['projects'],
        queryFn: () => getProjectList(),
    })

    const changeDrawer = (drawerId) => {
        return async () => {
            setFunc({drawer: drawerId})
            closeComponent()
        }
    }

    if (isPending) {
        return <Detail title="서랍 선택" onClose={closeComponent}/>
    }

    return (
        <Detail title="서랍 선택" onClose={closeComponent}>
            {projects?.map((project) => (
                <DrawerFolder key={project.id} project={project} changeDrawer={changeDrawer}/>
            ))}
        </Detail>
    )
}

export default Drawer