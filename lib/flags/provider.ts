export type FlagDefinitionsType = Record<string, {
  description: string;
  origin: string;
  options: Array<{ value: any; label: string }>;
}>;

export const flagsConfig: FlagDefinitionsType = {
  enableVideoConferencing: {
    description: 'Enable video conferencing feature',
    origin: '/api/flags',
    options: [
      { value: false, label: 'Disabled' },
      { value: true, label: 'Enabled' },
    ],
  },
  enableAIAssistant: {
    description: 'Enable AI teaching assistant (future feature)',
    origin: '/api/flags',
    options: [
      { value: false, label: 'Disabled' },
      { value: true, label: 'Enabled' },
    ],
  },
  maxMeetingParticipants: {
    description: 'Maximum participants per meeting',
    origin: '/api/flags',
    options: [
      { value: 10, label: '10 participants' },
      { value: 50, label: '50 participants' },
      { value: 100, label: '100 participants' },
    ],
  },
  enableGuestAccess: {
    description: 'Allow guest access to meetings',
    origin: '/api/flags',
    options: [
      { value: false, label: 'Disabled' },
      { value: true, label: 'Enabled' },
    ],
  },
};

export const defaultFlags = {
  enableVideoConferencing: true,
  enableAIAssistant: false,
  maxMeetingParticipants: 50,
  enableGuestAccess: true,
};
