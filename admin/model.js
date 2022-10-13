var school_model = {
    school_info: {
        name: req.body.name,
        logo: baseUrl + url[0].filename,
        email: req.body.email,
        phone: req.body.phone,
        adress: req.body.adress,
        pic1: baseUrl + url[1].filename,
        about: req.body.about,
        d_about: req.body.d_about,
        category: req.body.category,
        p_name: req.body.p_name,
        ppic: baseUrl + url[2].filename,
        vpname: req.body.vpname,
        vppic: baseUrl + url[3].filename,
        mission: req.body.mission,
        vision: req.body.vision,
        anthem: req.body.anthem,
        fees: req.body.fees,
        e_register: req.body.e_register,
        agent: req.body.agent,
        admin_username: "",
        admin_password: ""
    },
    news: [],
    fees_info: {
        bank_name: "",
        ac_num: "",
        fees: "",
    },
    feedbacks: [],
    classes: [],
    sessions: []
}



var session_model = {
    name: "",
    terms: [
        {
            name: "first",
            students: []
        },
        {
            name: "second",
            students: []
        },
        {
            name: "third",
            students: []
        },
    ]
}



student_model = {
    name: "",
    gender: "",
    dob: "",
    class: "",
    subjects: [],
    total: -1,
    average: -1,
    grade: "",
    position: -1,
    remarks: "",
}



news_model = {
    header: "",
    details: "",
    image: ""
}



feedbacks_model = {
    parent_name: "",
    message: "",
    email: "",
    date: ""
}



class_model = {
    name: "",
    subjects: []
}

class_subject = {
    name: ""
}



student_subject = {
    name: "",
    ass1: -1,
    ass2: -1,
    test1: -1,
    test2: -1,
    exams: -1,
    total: -1,
    grade: "",
    position: -1
}