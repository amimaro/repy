function Schema() {
    this.name = "";
    this.url = "";
    this.description = "";
    this.publisher = "";
    this.github = "";
    this.manager = "";
    this.distro = "";
    this.arch = "";
    this.selectedRelease = "";
    this.releases = [];
    this.img = "";
    this.down = "";
    this.options = {
        "sudo": false,
        "global": false,
        "save": false
    };
    this.isSelected = false;
}


module.exports = Schema;
