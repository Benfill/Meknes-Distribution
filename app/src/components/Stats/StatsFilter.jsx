import React, { useState } from 'react'
import BarGraph from '../Dashboard/BarGraph'
import CircleGraph from '../Dashboard/CircleGraph'
import Switch from '@mui/joy/Switch'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'

const StatsFilter = () => {
  const [showBarGraph, setShowBarGraph] = useState(true)

  return (
    <div className='flex flex-col items-center gap-4'>
      <Switch
        color={showBarGraph ? 'primary' : 'danger'}
        slotProps={{ input: { 'aria-label': 'graph type' } }}
        startDecorator={
          <BarChartIcon
            sx={{ color: showBarGraph ? 'primary.500' : 'text.tertiary' }}
          />
        }
        endDecorator={
          <PieChartIcon sx={{ color: showBarGraph ? 'text.tertiary' : 'danger.600' }} />
        }
        checked={showBarGraph}
        onChange={(event) => setShowBarGraph(event.target.checked)}
      />

      <div className='flex '>
        {!showBarGraph ? <BarGraph /> : <CircleGraph />}
      </div>
    </div>
  )
}

export default StatsFilter;