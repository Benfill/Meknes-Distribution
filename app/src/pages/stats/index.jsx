import React, { useEffect, useState } from 'react';
import { LittNumStat } from '../../components/Dashboard/LittNumStat';
import CircleGraph from '../../components/Dashboard/CircleGraph';
import BarGraph from '../../components/Dashboard/BarGraph';
import GET from '../../utils/GET';
import SearchInput from '../../components/Dashboard/SearchInput';
import { Spinner } from 'flowbite-react';
import MainCard from '../../components/Dashboard/MainCard';
import StatsFilter from '../../components/Stats/StatsFilter';

const icons = {
  client: (<svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>),
  product: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>),
  clientFile: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>),
  supplier: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>),
};

const Stats = () => {
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [val, setVal] = React.useState();
  const [filter, setFilter] = React.useState(null);
  const [filterLoading, setFilterLoad] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatsLoading(true);

      const fetchAdresses = async () => {
        const adrs = await GET('stats/communes');
        setAddresses(adrs.communes.map(i => ({ label: i.full_address, id: i.commune_id })));
      };

      let statsSession = JSON.parse(sessionStorage.getItem('stats'));
      if (statsSession && statsSession.message === 'success') {
        setStats(statsSession);
      } else {
        const response = await GET('stats');
        if (response.message === 'success') {
          setStats(response);
        }
      }

      await fetchAdresses();
      setStatsLoading(false);
    };

    fetchData();
  }, []);


  const onFilter = async (e, v) => {
    setFilterLoad(true);
    setVal(addresses.includes(v) ? v : null);
    setFilter(v ? await GET('stats/search/' + v.id, false) : null);
    setFilterLoad(false);
  }
  return (
    <div className='flex flex-col ml-16 mr-4'>
      <div className='flex justify-center items-center mt-4'>
        <SearchInput onFilter={onFilter} options={addresses} />
      </div>
      {filterLoading ? (<div className='top-1/2 lg:right-1/2 right-[45%] absolute overflow-hidden'><Spinner /></div>) : 
      (filter === null) ? (
        <>
          <div className='w-full grid gap-6 mb-4 md:grid-cols-2 xl:grid-cols-4 mt-6'>
            {statsLoading ? (
              <div className='flex justify-center items-center w-screen h-44'>
                <Spinner />
              </div>
            ) : (
              <>
                <LittNumStat htmlIcon={icons.clientFile} color='yellow' txt="Client Files Count" count={stats.clientFilesCount} />
                <LittNumStat htmlIcon={icons.client} color='green' txt="Client Count" count={stats.clientsCount} />
                <LittNumStat htmlIcon={icons.product} color='blue' txt="Products Count" count={stats.productsCount} />
                <LittNumStat htmlIcon={icons.supplier} color='red' txt="Suppliers Count" count={stats.suppliersCount} />
              </>
            )

            }
          </div>

          <div>
            <StatsFilter />
          </div>
        </>
      ) : (
        <>
          <div className='w-full grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3 mt-6'>
            <LittNumStat desc={val.label} txt="Client File  Count" color='yellow' htmlIcon={icons.clientFile} count={filter.clientFilesCount} />
            <LittNumStat desc={val.label} txt="Client Count" color='green' htmlIcon={icons.client} count={filter.clientsCount} />
            <LittNumStat desc={val.label} txt="Products Count" color='blue' htmlIcon={icons.product} count={filter.productsCount} />
          </div>
          <div className='w-full grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-6'>
            {filter.products.map(v => (
              <MainCard product={v} />
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default Stats;
