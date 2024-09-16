import AddTask from "@components/home/AddTask"
import Announcements from "@components/home/Announcements"
import AssignedToday from "@components/home/AssignedToday"
import Header from "@components/home/Header"
import OpenWithSafari from "@components/home/OpenWithSafari"

const HomePage = () => {
    return (
        <>
            <Header />
            <AddTask />
            <OpenWithSafari />
            <Announcements />
            <AssignedToday />
        </>
    )
}

export default HomePage
