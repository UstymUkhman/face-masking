import FaceTracking from '@/FaceTracking';

export default new FaceTracking(
  document.getElementById('start'),
  document.getElementById('video'),
  document.getElementById('canvas')
);
