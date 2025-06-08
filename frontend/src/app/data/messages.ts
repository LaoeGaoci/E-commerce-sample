export interface Message {
  id: string;           // 消息唯一 ID（字符串）
  title: string;        // 消息标题
  userId: string;       // 接收用户 ID（字符串）
  content: string;      // 消息正文
  timestamp: string;    // ISO 格式时间字符串
  isRead: boolean;      // 是否已读
}

export const initialMessages: Message[] = [
  {
    id: '1',
    title: '订单发货提醒',
    userId: '1',
    content: '您的订单已发货，预计3天内送达。',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
  {
    id: '2',
    title: '优惠活动通知',
    userId: '1',
    content: '亲爱的用户，今日全场满199减50，快来抢购吧！',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
  {
    id: '3',
    title: '账户登录提醒',
    userId: '1',
    content: '您的账号于今天上午10:35登录，如非本人操作请及时修改密码。',
    timestamp: new Date().toISOString(),
    isRead: true,
  },
];
