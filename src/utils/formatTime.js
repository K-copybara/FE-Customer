import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export const formatTime = (dateString) => {
  const target = dayjs(dateString).add(9, 'hour');
  const now = dayjs();

  if (now.diff(target, 'day') >= 30) {
    return target.format('YYYY.MM.DD');
  }

  return target.fromNow();
};

export const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY년 M월 D일');
};

export const extractTime = (datetime) => {
  return dayjs.utc(datetime).tz('Asia/Seoul').format('HH:mm');
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  return dayjs(isoString).format('YYYY-MM-DD HH:mm:ss');
};
