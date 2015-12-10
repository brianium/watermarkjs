jest.autoMockOff();

window.atob = function(base64) {
  return 'decoded!';
}

window.File = function() {

};

window.Image = function() {
  this.width = 50;
  this.height = 50;
}
