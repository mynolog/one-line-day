import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import 'react-calendar/dist/Calendar.css'
import './styles/Calendar.css'

type Reflections = Record<string, string>

export default function Popup() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reflections, setReflections] = useState<Reflections>({})
  const [input, setInput] = useState('')

  const dateKey = dayjs(selectedDate).format('M월 D일')

  useEffect(() => {
    const stored = localStorage.getItem('reflections')
    if (stored) {
      setReflections(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    setInput(reflections[dateKey] || '')
  }, [selectedDate, reflections, dateKey])

  const handleSave = () => {
    const updated = { ...reflections, [dateKey]: input }
    localStorage.setItem('reflections', JSON.stringify(updated))
    setReflections(updated)
  }

  return (
    <div className="p-4 w-[300px] text-sm font-sans">
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) setSelectedDate(value)
        }}
        value={selectedDate}
        calendarType="gregory"
        formatDay={(_, date) => date.getDate().toString()}
        maxDate={new Date()}
        tileClassName={({ date, view }) => {
          if (view !== 'month') return null
          const day = date.getDay()
          if (day === 0) return 'sunday'
          if (day === 6) return 'saturday'
          return null
        }}
      />
      <div className="mt-4">
        <p className="font-bold mb-2 text-gray-700">{dateKey} 짧은 회고</p>
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 text-sm resize-none
            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
            focus:border-transparent transition"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="✨ 오늘 하루를 간단히 돌아보며 한 줄 남겨보세요!"
        />
        <button
          className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  )
}
