import DetailFrame from "./DetailFrame"

const Memo = ({ onClose }) => {
    return (
        <DetailFrame title="메모 설정" onClose={onClose}>
            <div>Memo페이지입니다</div>
        </DetailFrame>
    )
}

export default Memo