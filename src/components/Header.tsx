import {
  FC, useEffect, useRef, useState, ChangeEvent, FormEvent, useContext,
} from 'react';
import { AppContext } from '../context/AppContext';
import { USER_ID } from '../USER_ID';
import { postTodo } from '../api/todos';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const {
    setErrorMessage, setShowError, setTempTodo, tempTodo, setTodos,
  } = useContext(AppContext);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');
      setShowError(true);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    try {
      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const response = await postTodo(newTodo);

      setTodos(prev => ([
        ...prev,
        response,
      ]));
      setInputValue('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      setShowError(true);
    } finally {
      setTempTodo(null);
    }
  };

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  });

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleInputSubmit}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
