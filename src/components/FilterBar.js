import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectFilter, FILTERS } from '../redux/tasksSlice';
import '../styles/FilterBar.css';


function FilterBar() {
  const dispatch = useDispatch();
  const activeFilter = useSelector(selectFilter);

  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks by priority">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`filter-bar__btn${
            f === activeFilter ? ' filter-bar__btn--active' : ''
          }`}
          onClick={() => dispatch(setFilter(f))}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
