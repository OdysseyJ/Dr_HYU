// 구면 코사인 법칙(Spherical Law of Cosine) 으로 두 위도/경도 지점의 거리를 구함
// 반환 거리 단위 (km)
function computeDistance (startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude)
  var startLongRads = degreesToRadians(startCoords.longitude)
  var destLatRads = degreesToRadians(destCoords.latitude)
  var destLongRads = degreesToRadians(destCoords.longitude)

  var Radius = 6371 // 지구의 반경(km)
  var distance =
    Math.acos(
      Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) *
          Math.cos(destLatRads) *
          Math.cos(startLongRads - destLongRads)
    ) * Radius

  return distance
}

function degreesToRadians (degrees) {
  radians = degrees * Math.PI / 180
  return radians
}

exports.computeDistance = computeDistance
