import { useContext } from "react";

import { useTickets } from "@/hooks/useTickets";
import { useDesks } from "@/hooks/useDesks";

import { SocketContext } from "@/context/socketContext";

import OnlineBoxCard from "@/components/queueComponents/OnlineBoxCard";
import DailyTickets from "@/components/queueComponents/DailyTickets";
import DeskRanking from "@/components/queueComponents/DeskRanking";
import PrefixTickets from "@/components/queueComponents/PrefixTickets";
import LastTicketCalled from "@/components/queueComponents/LastTicketCalled";
import Last10TicketsStatus from "@/components/queueComponents/Last10TicketsStatus";
import HourlyTicketsTrend from "@/components/queueComponents/HourlyTicketsTrend";

const Dashboard = () => {
    const { socket } = useContext(SocketContext);
    const { tickets, ticketsLoading, lastCalledTicket } = useTickets(socket);
    const { desks, desksLoading } = useDesks(socket);

    return (
        <>
            <div className="auto-grid">
                <DailyTickets tickets={tickets} isLoading={ticketsLoading} />

                <OnlineBoxCard desks={desks} isLoading={desksLoading} />

                <DeskRanking tickets={tickets} isLoading={ticketsLoading} />

                <PrefixTickets tickets={tickets} isLoading={ticketsLoading} />

                <LastTicketCalled lastCalledTicket={lastCalledTicket} />
            </div>

            <div className="auto-grid gap-4 items-stretch">
                <Last10TicketsStatus tickets={tickets} />

                <HourlyTicketsTrend tickets={tickets} />
            </div>
        </>
    );
};

export default Dashboard;
