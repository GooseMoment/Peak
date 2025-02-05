import AddTask from "@components/home/AddTask"
import Announcements from "@components/home/Announcements"
import AssignedToday from "@components/home/AssignedToday"
import Header from "@components/home/Header"
import InstallPeak from "@components/home/InstallPeak"

const HomePage = () => {
    return (
        <>
            <Header />
            <AddTask />
            <InstallPeak />
            <Announcements />
            <AssignedToday />
        </>
    )
}

export default HomePage
