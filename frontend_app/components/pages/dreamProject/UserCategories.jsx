import React, {PropTypes} from 'react';

export default function UserCategories({categories}) {

}

const userShape = PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
});

UserCategories.propTypes = {
    categories: PropTypes.shape({
        title: PropTypes.string.isRequired,
        users: userShape.isRequired,
    }),
};
