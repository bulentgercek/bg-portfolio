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
exports.PortfolioItem = void 0;
const typeorm_1 = require("typeorm");
const Content_1 = require("./Content");
const Portfolio_1 = require("./Portfolio");
const PortfolioCategory_1 = require("./PortfolioCategory");
let PortfolioItem = class PortfolioItem {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PortfolioItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PortfolioItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PortfolioItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PortfolioItem.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PortfolioItem.prototype, "updatedDate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => PortfolioCategory_1.PortfolioCategory, (portfolioCategory) => portfolioCategory.portfolioItem),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], PortfolioItem.prototype, "portfolioCategory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Content_1.Content, (content) => content.portfolioItem),
    __metadata("design:type", Array)
], PortfolioItem.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Portfolio_1.Portfolio, (portfolio) => portfolio.portfolioItem, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Portfolio_1.Portfolio)
], PortfolioItem.prototype, "portfolio", void 0);
PortfolioItem = __decorate([
    (0, typeorm_1.Entity)({ name: "portfolio_items" })
], PortfolioItem);
exports.PortfolioItem = PortfolioItem;
