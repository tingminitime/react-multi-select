import { useState } from 'react'
import Select, { SelectOption } from './components/Select'

const options = [
  {
    label: 'First',
    value: 1,
  },
  {
    label: 'Second',
    value: 2,
  },
  {
    label: 'Third',
    value: 3,
  },
  {
    label: 'Fourth',
    value: 4,
  },
  {
    label: 'Fifth',
    value: 5,
  },
]

function App() {
  const [multiSelectValue, setMultiSelectValue] = useState<SelectOption[]>([
    options[0],
  ])
  const [singleSelectValue, setSingleSelectValue] = useState<
    SelectOption | undefined
  >(options[0])

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Select
        multiple
        options={options}
        value={multiSelectValue}
        onChange={setMultiSelectValue}
      ></Select>
      <br></br>
      <Select
        options={options}
        value={singleSelectValue}
        onChange={setSingleSelectValue}
      ></Select>
      <div style={{ color: 'white', marginTop: '1rem' }}>
        Source :{' '}
        <a
          href="https://youtu.be/bAJlYgeovlg"
          target="_blank"
          style={{ color: 'white' }}
        >
          Youtube
        </a>
        <span> - @WebDevSimplified</span>
      </div>
    </div>
  )
}

export default App
