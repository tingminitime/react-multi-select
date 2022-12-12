import styles from '@/select.module.css'
import { useRef, useState, useLayoutEffect, useEffect } from 'react'

export type SelectOption = {
  label: string
  value: string | number
}

type MultipleSelectProps = {
  multiple: true
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

type SingleSelectProps = {
  multiple?: false
  value?: SelectOption
  onChange: (value: SelectOption | undefined) => void
}

type SelectProps = {
  options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options }: SelectProps) => {
  console.log('[Select rerender]')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined)
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        onChange(value.filter(o => o !== option))
      } else {
        onChange([...value, option])
      }
    } else {
      if (option !== value) onChange(option)
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value
  }

  useLayoutEffect(() => {
    if (isOpen) setHighlightIndex(prev => prev)
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log(e.target)
      if (e.target !== containerRef.current) return
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen(prev => !prev)
          if (isOpen) selectOption(options[highlightIndex])
          break
        case 'ArrowUp':
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true)
            break
          }

          const newValue = highlightIndex + (e.code === 'ArrowDown' ? 1 : -1)
          if (newValue >= options.length) {
            setHighlightIndex(0)
          } else if (newValue < 0) {
            setHighlightIndex(options.length - 1)
          } else {
            setHighlightIndex(newValue)
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
        default:
          break
      }
    }
    containerRef.current?.addEventListener('keydown', handler)

    return () => {
      containerRef.current?.removeEventListener('keydown', handler)
    }
  }, [isOpen, highlightIndex, options])

  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen(prev => !prev)}
      onBlur={() => setIsOpen(false)}
      className={styles.container}
      tabIndex={0}
    >
      <div className={styles.value}>
        {multiple
          ? value.map(v => (
              <button
                type="button"
                className={styles['option-badge']}
                key={v.value}
                onClick={e => {
                  e.stopPropagation()
                  selectOption(v)
                }}
              >
                {v.label}
                <span className={styles['remove-btn']}>&times;</span>
              </button>
            ))
          : value?.label}
      </div>
      <button
        type="button"
        className={styles['clear-btn']}
        onClick={e => {
          e.stopPropagation()
          clearOptions()
        }}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((option, index) => (
          <li
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ''
            } ${index === highlightIndex ? styles.highlighted : ''}`}
            onMouseEnter={() => {
              setHighlightIndex(index)
            }}
            onClick={e => {
              e.stopPropagation()
              selectOption(option)
              setIsOpen(false)
            }}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Select
