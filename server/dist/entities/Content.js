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
exports.Content = void 0;
const typeorm_1 = require("typeorm");
const Asset_1 = require("./Asset");
const PortfolioItem_1 = require("./PortfolioItem");
let Content = class Content {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Content.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Content.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], Content.prototype, "columns", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PortfolioItem_1.PortfolioItem, (portfolioItem) => portfolioItem.content, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", PortfolioItem_1.PortfolioItem)
], Content.prototype, "portfolioItem", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Asset_1.Asset, (asset) => asset.content),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Content.prototype, "asset", void 0);
Content = __decorate([
    (0, typeorm_1.Entity)({ name: "contents" })
], Content);
exports.Content = Content;
