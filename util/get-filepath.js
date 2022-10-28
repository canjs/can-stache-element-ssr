/**
 * Create a normalized file path based on url
 *
 * TODO: consider query params (or confirm that they aren't a part of requirements)
 */
module.exports = function (url, filename) {
  const path = url
    .replace(/https?:\/\//, "")
    .replace(/[^a-zA-Z0-9- /]/g, "_")
    .replace(/^[^/]*?(\/|$)/, "")

  return `${path}/${filename}`.replace(/^\//, "")
}
