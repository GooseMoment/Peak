import AddTask from "@components/home/AddTask"
import AllowNotification from "@components/home/AllowNotification"
import Announcements from "@components/home/Announcements"
import AssignedToday from "@components/home/AssignedToday"
import Header from "@components/home/Header"
import InstallPeak from "@components/home/InstallPeak"

const HomePage = () => {
    return (
        <>
            <Header />
            <AddTask />
            <AllowNotification />
            <InstallPeak />
            <Announcements />
            <AssignedToday />
        </>
    )
}

export default HomePage
