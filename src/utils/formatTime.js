import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

export const formatDate = (dateString) => {
  return dayjs.utc(dateString).tz('Asia/Seoul').format('YYYY년 M월 D일');
};

export const extractTime = (datetime) => {
  return dayjs(datetime).format('HH:mm');
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '';
  return dayjs(isoString).format('YYYY-MM-DD HH:mm:ss');
};
