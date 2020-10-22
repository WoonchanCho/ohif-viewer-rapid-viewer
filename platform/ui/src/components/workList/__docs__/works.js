import moment from 'moment';

const works = [
  {
    workId: '1.3.6.1.4.1.25403.345050719074.3824.20170126085406.1',
    username: 'admin',
    name: 'Sample Worklist #1',
    description: 'This is sample worklist.',
    totalCount: 10,
    finishedCount: 5,
    createdDate: moment().format('YYYYMMDD'),
    dueDate: moment().format('YYYYMMDD'),
  },
  {
    workId: '1.3.6.1.4.1.25403.345050719074.3824.20170125112931.11',
    username: 'admin',
    name: 'Sample Worklist #2',
    description: 'This is sample worklist.',
    totalCount: 10,
    finishedCount: 5,
    createdDate: moment()
      .subtract(14, 'days')
      .format('YYYYMMDD'),
    dueDate: moment()
      .subtract(30, 'days')
      .format('YYYYMMDD'),
  },
  {
    workId: '1.2.840.113619.2.30.1.1762295590.1623.978668949.886',
    username: 'admin',
    name: 'Sample Worklist #3',
    description: 'This is sample worklist.',
    totalCount: 10,
    finishedCount: 5,
    createdDate: moment()
      .subtract(1, 'month')
      .format('YYYYMMDD'),
    dueDate: moment()
      .subtract(10, 'days')
      .format('YYYYMMDD'),
  },
].sort(function(a, b) {
  if (a.dueDate < b.dueDate) {
    return -1;
  }
  if (a.dueDate > b.dueDate) {
    return 1;
  }
  return 0;
});

export default works;
