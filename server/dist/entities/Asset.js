"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = exports.AssetType = void 0;
const typeorm_1 = require("typeorm");
const Content_1 = require("./Content");
var AssetType;
(function (AssetType) {
    AssetType["Image"] = "image";
    AssetType["Video"] = "video";
})(AssetType = exports.AssetType || (exports.AssetType = {}));
let Asset = class Asset {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Asset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: AssetType, default: AssetType.Image }),
    __metadata("design:type", String)
], Asset.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Asset.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Content_1.Content, (content) => content.asset),
    __metadata("design:type", Array)
], Asset.prototype, "content", void 0);
Asset = __decorate([
    (0, typeorm_1.Entity)({ name: "assets" })
], Asset);
exports.Asset = Asset;
