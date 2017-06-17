window.onload = function () {
  var resourceTimingList = data || performance.getEntries();
  var timing = {"navigationStart":1497174208940,"unloadEventStart":1497174209408,"unloadEventEnd":1497174209410,"redirectStart":0,"redirectEnd":0,"fetchStart":1497174208940,"domainLookupStart":1497174208940,"domainLookupEnd":1497174208940,"connectStart":1497174208940,"connectEnd":1497174208940,"secureConnectionStart":0,"requestStart":1497174208951,"responseStart":1497174209406,"responseEnd":1497174209498,"domLoading":1497174209416,"domInteractive":1497174209757,"domContentLoadedEventStart":1497174209758,"domContentLoadedEventEnd":1497174209759,"domComplete":1497174210525,"loadEventStart":1497174210525,"loadEventEnd":1497174210526};
  waterfall.init( resourceTimingList, timing );
  waterfall.render();
}
