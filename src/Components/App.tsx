import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from '../UserWarning';
import { getTodos, USER_ID } from '../api/todos';
import { Header } from './Header';
import { Main } from './Main';
import { Footer } from './Footer';
import { Todo } from '../types/Todo';
import { ERROR, ErrorType } from '../types/Error';
import { FILTER, Filter } from '../types/Filter';
import { Status, STATUS } from '../types/Status';
import { ErrorMessage } from './ErrorMessage';
import { TODO_STATE, TodoState } from '../types/TodoState';
const loadedTodos = getTodos();

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>(FILTER.all);
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [status, setStatus] = useState<Status>(STATUS.idle);
  const [error, setErrorType] = useState<ErrorType>(ERROR.noError);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoState, setNewTodoState] = useState<TodoState>(TODO_STATE.idle);

  const filteredTodos = useMemo(() => {
    let filterTodos = todos;

    switch (filter) {
      case FILTER.all:
        break;
      case FILTER.active:
        filterTodos = todos.filter(todo => !todo.completed);
        break;
      case FILTER.completed:
        filterTodos = todos.filter(todo => todo.completed);
        break;
      default:
        break;
    }

    return filterTodos;
  }, [filter, todos]);

  useEffect(() => {
    setErrorType(ERROR.noError);
    setStatus(STATUS.pending);
    loadedTodos
      .then(data => {
        setTodos(data);
        setStatus(STATUS.resolved);
      })
      .catch(() => setErrorType(ERROR.couldntLoadTodos));
    if (newTodoState === TODO_STATE.resolved) {
      setTempTodo(null);
    }
  }, [newTodoState, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setNewTodoState={setNewTodoState}
          tempTodo={tempTodo}
          setTempTodo={setTempTodo}
          setErrorType={setErrorType}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
        />
        {status === 'resolved' && (
          <Main tempTodo={tempTodo} todos={filteredTodos} />
        )}
        {status === 'resolved' && todos.length !== 0 && (
          <Footer todos={todos} filter={filter} setFilter={setFilter} />
        )}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};
