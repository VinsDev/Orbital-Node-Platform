const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;

const url = dbConfig.url;

const mongoClient = new MongoClient(url);
mongoClient.connect();

const database = mongoClient.db(dbConfig.database);
const schools = database.collection("schools");


const computeResults = async (sname, session, term, s_class) => {
    try {
        let school_data = await schools.findOne({ 'school_info.name': sname });

        var sessionIndex = school_data.sessions.findIndex(i => i.name === session);
        var termIndex = school_data.sessions[sessionIndex].terms.findIndex(i => i.name === term);
        var classIndex = school_data.classes.findIndex(i => i.name === s_class);

        subjectsTotal(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        termTotal(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        subjectPositions(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        termPositions(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        termAverage(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        subjectAverage(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        subjectGrade(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        highest(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        lowest(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);
        remarks(sname, session, term, school_data.sessions[sessionIndex].terms[termIndex].students, s_class, school_data.classes[classIndex].subjects);

    } catch (error) {
        return console.log(error);
    }

}
function subjectsTotal(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    var total = 0;
    for (var i = 0; i < classStudents.length; i++) {
        for (var j = 0; j < subjects.length; j++) {
            total = classStudents[i].subjects[j].ass.reduce((a, b) => a + b, 0);
            schools.updateOne({ "school_info.name": sname },
                { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].total": total } },
                {
                    arrayFilters:
                        [{ "sess.name": session },
                        { "term.name": term },
                        { "stud.name": classStudents[i].name },
                        { "sub.name": subjects[j].name }]
                })
            total = 0;
        }
    }
}
function termTotal(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    var total = 0;
    for (var i = 0; i < classStudents.length; i++) {
        for (var j = 0; j < subjects.length; j++) {
            total += classStudents[i].subjects[j].total;
        }
        schools.updateOne({ "school_info.name": sname },
            { $set: { "sessions.$[sess].terms.$[term].students.$[stud].total": total } },
            {
                arrayFilters:
                    [{ "sess.name": session },
                    { "term.name": term },
                    { "stud.name": classStudents[i].name }]
            })
        total = 0;
    }
}
function subjectPositions(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    var namesAndSubjectTotal = [];
    for (var i = 0; i < subjects.length; i++) {
        for (var j = 0; j < classStudents.length; j++) {
            namesAndSubjectTotal.push({
                name: classStudents[j].name,
                total: classStudents[j].subjects[i].total
            })
        }
        namesAndSubjectTotal.sort((a, b) => b.total - a.total);
        for (var k = 0; k < classStudents.length; k++) {
            schools.updateOne({ "school_info.name": sname },
                { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].position": namesAndSubjectTotal.findIndex(s => s.name === classStudents[k].name) + 1 } },
                {
                    arrayFilters:
                        [{ "sess.name": session },
                        { "term.name": term },
                        { "stud.name": classStudents[k].name },
                        { "sub.name": subjects[i].name }]
                })
        }
        namesAndSubjectTotal = [];
    }
}
function termPositions(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    var sortedStudentsList = classStudents;
    sortedStudentsList.sort((a, b) => b.total - a.total);
    for (var i = 0; i < subjects.length; i++) {
        for (var k = 0; k < classStudents.length; k++) {
            schools.updateOne({ "school_info.name": sname },
                { $set: { "sessions.$[sess].terms.$[term].students.$[stud].position": sortedStudentsList.findIndex(s => s.name === classStudents[k].name) + 1 } },
                {
                    arrayFilters:
                        [{ "sess.name": session },
                        { "term.name": term },
                        { "stud.name": classStudents[k].name }]
                })
        }
    }
}
function termAverage(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    for (var i = 0; i < classStudents.length; i++) {
        schools.updateOne({ "school_info.name": sname },
            { $set: { "sessions.$[sess].terms.$[term].students.$[stud].average": classStudents[i].total / subjects.length } },
            {
                arrayFilters:
                    [{ "sess.name": session },
                    { "term.name": term },
                    { "stud.name": classStudents[i].name }]
            })
    }
}
function subjectAverage(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    var total = 0;
    for (var i = 0; i < subjects.length; i++) {
        for (var j = 0; j < classStudents.length; j++) {
            total += classStudents[j].subjects[i].total;
        }
        for (var k = 0; k < classStudents.length; k++) {
            schools.updateOne({ "school_info.name": sname },
                { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].average": total / classStudents.length } },
                {
                    arrayFilters:
                        [{ "sess.name": session },
                        { "term.name": term },
                        { "stud.name": classStudents[k].name },
                        { "sub.name": subjects[i].name }]
                })
        }
        total = 0;
    }
}
function subjectGrade(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    for (var i = 0; i < classStudents.length; i++) {
        for (var j = 0; j < subjects.length; j++) {
            schools.updateOne({ "school_info.name": sname },
                { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].grade": gradeHelper(classStudents[i].subjects[j].total) } },
                {
                    arrayFilters:
                        [{ "sess.name": session },
                        { "term.name": term },
                        { "stud.name": classStudents[i].name },
                        { "sub.name": subjects[j].name }]
                })
        }
    }
}
function gradeHelper(score) {
    if (score <= 100 && score >= 75) {
        return "A";
    }
    else {
        if (score < 75 && score >= 65) {
            return "B";
        }
        else {
            if (score < 65 && score >= 55) {
                return "C";
            }
            else {
                if (score < 55 && score >= 40) {
                    return "D";
                }
                else {
                    if (score < 40 && score >= 0) {
                        return "E";
                    }
                    else {
                        return "Q"
                    }
                }
            }
        }
    }
}
function highest(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    for (var i = 0; i < classStudents.length; i++) {
        for (var j = 0; j < subjects.length; j++) {
            for (var k = 0; k < classStudents.length; k++) {
                if (classStudents[k].subjects[j].position === 1) {
                    schools.updateOne({ "school_info.name": sname },
                        { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].highest": classStudents[k].subjects[j].total } },
                        {
                            arrayFilters:
                                [{ "sess.name": session },
                                { "term.name": term },
                                { "stud.name": classStudents[i].name },
                                { "sub.name": subjects[j].name }]
                        })
                    break;
                }
            }
        }
    }
}
function lowest(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    for (var i = 0; i < classStudents.length; i++) {
        for (var j = 0; j < subjects.length; j++) {
            for (var k = 0; k < classStudents.length; k++) {
                if (classStudents[k].subjects[j].position === classStudents.length) {
                    schools.updateOne({ "school_info.name": sname },
                        { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub].lowest": classStudents[k].subjects[j].total } },
                        {
                            arrayFilters:
                                [{ "sess.name": session },
                                { "term.name": term },
                                { "stud.name": classStudents[i].name },
                                { "sub.name": subjects[j].name }]
                        })
                    break;
                }
            }
        }
    }
}
function remarks(sname, session, term, students, s_class, subjects) {
    var classStudents = students.filter(function (value) {
        return value.class === s_class;
    });
    for (var i = 0; i < classStudents.length; i++) {
        schools.updateOne({ "school_info.name": sname },
            { $set: { "sessions.$[sess].terms.$[term].students.$[stud].remarks": remarkHelper(classStudents[i].average) } },
            {
                arrayFilters:
                    [{ "sess.name": session },
                    { "term.name": term },
                    { "stud.name": classStudents[i].name }]
            })
    }
}
function remarkHelper(average) {
    if (average <= 100 && average >= 75) {
        return "An Outstanding result. Keep it up.";
    }
    else {
        if (average < 75 && average >= 65) {
            return "An Excellent Performance. Keep it up.";
        }
        else {
            if (average < 65 && average >= 55) {
                return "A Good Result. You can do better.";
            }
            else {
                if (average < 55 && average >= 40) {
                    return "A fair performance. Improve next time.";
                }
                else {
                    if (average < 40 && average >= 0) {
                        return "Poor result. Sit up.";
                    }
                    else {
                        return "R"
                    }
                }
            }
        }
    }
}

module.exports = { computeResults }