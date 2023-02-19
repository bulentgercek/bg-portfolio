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
exports.PortfolioCategory = void 0;
const typeorm_1 = require("typeorm");
const Portfolio_1 = require("./Portfolio");
const PortfolioItem_1 = require("./PortfolioItem");
let PortfolioCategory = class PortfolioCategory {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PortfolioCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PortfolioCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], PortfolioCategory.prototype, "itemsOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => PortfolioItem_1.PortfolioItem, (portfolioItem) => portfolioItem.portfolioCategory),
    __metadata("design:type", Array)
], PortfolioCategory.prototype, "portfolioItem", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Portfolio_1.Portfolio, (portfolio) => portfolio.portfolioCategory, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Portfolio_1.Portfolio)
], PortfolioCategory.prototype, "portfolio", void 0);
PortfolioCategory = __decorate([
    (0, typeorm_1.Entity)({ name: "portfolio_categories" })
], PortfolioCategory);
exports.PortfolioCategory = PortfolioCategory;
