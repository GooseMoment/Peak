import DetailFrame from "@components/project/common/DetailFrame"

const Repeat = ( { onClose } ) => {
    return (
        <DetailFrame title="반복 설정" onClose={onClose}>
            <div>Repeat 창입니다</div>
        </DetailFrame>
    )
}

export default Repeat