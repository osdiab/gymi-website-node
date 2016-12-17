import React, {PropTypes} from 'react';
import {Link} from 'react-router';


/**
 * Expects unique title
 * @param categories
 * @returns React node
 * @constructor
 */
export default function UserCategories({categories}) {
  return (
    <div className="UserCategories">
      {categories.map(category => (
        <div key={category.title} className="UserCategories--category">
          <h3 className="UserCategories--categoryTitle">{category.title}</h3>
          <ul>
            {category.users.map(user => (
              <li key={user.id} className="UserCategories--category--user">
                <Link to={`/dreamProject/profile/${user.id}`}>{user.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const userShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
});

UserCategories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    users: userShape.isRequired,
  })).isRequired,
};
