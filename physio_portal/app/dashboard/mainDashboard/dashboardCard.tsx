
import React from 'react'
import Loading from '../../component/loading/loading'

type DashboardCardProps = {
    infoType: string;
    cardTitle: string;
    infoNumber: number | undefined;
}

const DashboardCard: React.FC<DashboardCardProps> = ({infoType, cardTitle, infoNumber}) => {
    return (
    <div className='w-full min-h-[200px] bg-white shadow-xl rounded-lg p-5 flex flex-col justify-center items-center'>
        <h1 className='customH1 mb-5'>{cardTitle}</h1>
        {infoNumber === undefined ? 
            <Loading />
        : 
            <p className='text-5xl font-bold text-(--primary)'>{infoNumber}</p>
        }
        <div className='w-full  mt-5 flex items-end justify-end'>
            <button className='customDashBoardCardBttn'>
                View all
            </button>
        </div>
    </div>
  )
}

export default DashboardCard
