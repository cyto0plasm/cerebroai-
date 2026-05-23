export const GUEST_SESSION_KEY = 'cerebro_guest_ok';

export function isGuestSessionChosen() {
  return (
    sessionStorage.getItem(GUEST_SESSION_KEY) === '1' ||
    sessionStorage.getItem('axial_guest_ok') === '1'
  );
}

export function markGuestSessionChosen() {
  sessionStorage.setItem(GUEST_SESSION_KEY, '1');
  sessionStorage.removeItem('axial_guest_ok');
}

export function clearGuestSessionChoice() {
  sessionStorage.removeItem(GUEST_SESSION_KEY);
  sessionStorage.removeItem('axial_guest_ok');
}
