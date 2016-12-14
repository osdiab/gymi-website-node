import React, {PropTypes} from 'react';

import UserList from './UserList';

import './DreamProjectStudentsPage.less';

export default function DreamProjectStudentsPage({selectedField, fields, periods, students}) {
    const title = selectedField ? "Students by year" : `Students interested in ${selectedField.title}`;
    const categories = students && periods ? [] : null;
    return (
        <div>
            <div className="DreamProjectStudentsPage--period">
                <h2>{title}</h2>
                <UserCategories categories={categories} />
            </div>
            <div className="DreamProjectStudentsPage--sidebar">
                <Button action={() => alert("hi")}>
                    <h4>Filter by year</h4>
                </Button>
                <h4>Filter by field</h4>
                {fields && fields.map((field) => (
                    <Button key={field.id} action={() => alert(field.title)}>
                        {field.title}
                    </Button>
                ))}
            </div>
        </div>
    );
}

DreamProjectStudentsPage.propTypes = {
    selectedField: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    )),
    periods: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
    })),
    students: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        primaryInterestId: PropTypes.string,
    })),
};

function mapStateToProps(state) {
}
