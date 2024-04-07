import { useOutletContext } from "react-router-dom"

import Detail from "@components/project/common/Detail"

const Memo = () => {
    const [closeComponent] = useOutletContext()

    return (
        <Detail title="메모 설정" onClose={closeComponent}>
            <div>Memo페이지입니다</div>
        </Detail>
    )
}

export default Memo