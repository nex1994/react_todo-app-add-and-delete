import { FormEventHandler } from 'react';
import { ErrorType, ERROR } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { TODO_STATE, TodoState } from '../../types/TodoState';
import { postTodo } from '../../api/todos';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (title: string) => void;
  setErrorType: (error: ErrorType) => void;
  setTempTodo: (todo: Todo | null) => void;
  setNewTodoState: (state: TodoState) => void;
  addTodo: (todo: Todo) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  setErrorType,
  setTempTodo,
  setNewTodoState,
  addTodo,
  // tempTodo,
}) => {
  const handleSumbit: FormEventHandler = event => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setErrorType(ERROR.noTitle);
    }

    if (newTodoTitle.trim() !== '') {
      setNewTodoState(TODO_STATE.loading);

      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      };

      setTempTodo(newTodo);

      postTodo(newTodo)
        .then(response => {
          addTodo(response);
          setNewTodoTitle('');
          setTempTodo(null);
          setNewTodoState(TODO_STATE.resolved);
        })
        .catch(() => {
          setNewTodoState(TODO_STATE.rejected);
          setErrorType(ERROR.unableToAdd);
        })
        .finally(() => setNewTodoState(TODO_STATE.idle));
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSumbit}>
        <input
          value={newTodoTitle}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
