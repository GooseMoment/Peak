import Detail from "@components/project/common/Detail"

const Memo = ({setFunc, closeComponent}) => {
    return (
        <Detail title="메모 설정" onClose={closeComponent}>
            <div>Memo페이지입니다</div>
        </Detail>
    )
}

export default Memo