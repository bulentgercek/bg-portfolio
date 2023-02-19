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
exports.Portfolio = void 0;
const typeorm_1 = require("typeorm");
const PortfolioCategory_1 = require("./PortfolioCategory");
const PortfolioItem_1 = require("./PortfolioItem");
let Portfolio = class Portfolio {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Portfolio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Portfolio.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Portfolio.prototype, "categoriesOrder", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Portfolio.prototype, "itemsOrder", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PortfolioCategory_1.PortfolioCategory, (portfolioCategory) => portfolioCategory.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "portfolioCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PortfolioItem_1.PortfolioItem, (portfolioItem) => portfolioItem.portfolio),
    __metadata("design:type", Array)
], Portfolio.prototype, "portfolioItem", void 0);
Portfolio = __decorate([
    (0, typeorm_1.Entity)({ name: "portfolios" })
], Portfolio);
exports.Portfolio = Portfolio;
