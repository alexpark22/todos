import { useState } from 'react'

function useTodos() {
  const [todos, setTodos] = useState(() =>
    JSON.parse(localStorage.getItem('todos') || '[]')
  )

  const save = (next) => {
    setTodos(next)
    localStorage.setItem('todos', JSON.stringify(next))
  }

  return {
    todos,
    add: (text) => save([{ id: crypto.randomUUID(), text, done: false }, ...todos]),
    toggle: (id) => save(todos.map(t => t.id === id ? { ...t, done: !t.done } : t)),
    remove: (id) => save(todos.filter(t => t.id !== id)),
    clearDone: () => save(todos.filter(t => !t.done)),
  }
}

const FILTERS = ['all', 'active', 'done']

export default function App() {
  const { todos, add, toggle, remove, clearDone } = useTodos()
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const visible = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'active' ? !t.done :
    t.done
  )

  const remaining = todos.filter(t => !t.done).length
  const hasCompleted = todos.some(t => t.done)

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    add(text)
    setInput('')
  }

  return (
    <div className="app">
      <header>
        <h1>Todos</h1>
        <span className="date">{today}</span>
      </header>

      <div className="subhead">
        <div className="filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={'filter-btn' + (filter === f ? ' active' : '')}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {todos.length > 0 && (
          <span className="count">{remaining} remaining</span>
        )}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a task..."
          autoComplete="off"
        />
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <ul className="list">
        {visible.length === 0 ? (
          <li className="empty">Nothing here.</li>
        ) : (
          visible.map(todo => (
            <li key={todo.id} className={'todo-item' + (todo.done ? ' done' : '')}>
              <div className="check" onClick={() => toggle(todo.id)} />
              <span className="todo-text">{todo.text}</span>
              <button className="delete-btn" onClick={() => remove(todo.id)}>&times;</button>
            </li>
          ))
        )}
      </ul>

      {todos.length > 0 && (
        <div className="footer">
          <button
            className="clear-btn"
            onClick={clearDone}
            style={{ visibility: hasCompleted ? 'visible' : 'hidden' }}
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  )
}
