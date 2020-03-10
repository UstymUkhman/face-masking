import FaceMasking from '@/FaceMasking';

export default new FaceMasking(
  document.getElementById('start'),
  document.getElementById('video'),
  document.getElementById('intensity')
);
