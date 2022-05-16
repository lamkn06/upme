import moment from 'moment';

const sortTimelineDateReverse = (exp1, exp2) => {
    if (exp1.isCurrent) return -1;
    if (exp2.isCurrent) return 1;
    const exp1Date = exp1.endDate ? moment(exp1.endDate) : -1;
    const exp2Date = exp2.endDate ? moment(exp2.endDate) : -1;
    if (exp1Date > exp2Date) return -1;
    if (exp1Date < exp2Date) return 1;
    return 0;
  };

export const sortTimeline = (timelines) => {
    const newTimelines = [...timelines];
    if (newTimelines.length === 0) return newTimelines;
    return newTimelines.sort(sortTimelineDateReverse);
}

const sortEducationDateReverse = (edu1, edu2) => {
    const edu1Date = edu1.educateTo ? moment(edu1.educateTo) : -1;
    const edu2Date = edu2.educateTo ? moment(edu2.educateTo) : -1;
    if (edu1Date > edu2Date) return -1;
    if (edu1Date < edu2Date) return 1;
    return 0;
  };

export const sortEducation = (educations) => {
    const newEducations = [...educations];

    if (newEducations.length === 0) return newEducations;
    newEducations.sort(sortEducationDateReverse);
    return newEducations;
}