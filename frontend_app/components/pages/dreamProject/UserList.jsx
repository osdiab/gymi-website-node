import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default function UserList({users}) {
    return (
        <ul className="UserList">
            {users.map(user => (
                <li className="UserList--user" key={user.id}>
                    <Link to={`/dreamProject/profile/${user.id}`}>{user.name}</Link>
                </li>
            ))}
        </ul>
    );
}

const userShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
});

UserList.propTypes = {
    users: PropTypes.arrayOf(userShape).isRequired,
};
