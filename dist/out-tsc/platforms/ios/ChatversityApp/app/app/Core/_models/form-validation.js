"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomFormValidation = /** @class */ (function () {
    function CustomFormValidation() {
        this.eduEmailValidation = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-.]+.[e]+[d]+[u]+$';
        this.regularEmailValidation = '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$';
        this.passwordValidation = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';
    }
    return CustomFormValidation;
}());
exports.CustomFormValidation = CustomFormValidation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS12YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9DaGF0dmVyc2l0eUFwcC9hcHAvYXBwL0NvcmUvX21vZGVscy9mb3JtLXZhbGlkYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtJQUFBO1FBQ0ksdUJBQWtCLEdBQVUsZ0RBQWdELENBQUM7UUFDN0UsMkJBQXNCLEdBQVUsaURBQWlELENBQUM7UUFDbEYsdUJBQWtCLEdBQVUsNkNBQTZDLENBQUM7SUFDOUUsQ0FBQztJQUFELDJCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQ3VzdG9tRm9ybVZhbGlkYXRpb24ge1xuICAgIGVkdUVtYWlsVmFsaWRhdGlvbjpzdHJpbmcgPSAnXlthLXpBLVowLTlfListXStAW2EtekEtWjAtOS0uXSsuW2VdK1tkXStbdV0rJCc7XG4gICAgcmVndWxhckVtYWlsVmFsaWRhdGlvbjpzdHJpbmcgPSAnXlthLXpBLVowLTlfListXStAW2EtekEtWjAtOS1dKy5bYS16QS1aMC05LS5dKyQnO1xuICAgIHBhc3N3b3JkVmFsaWRhdGlvbjpzdHJpbmcgPSAnXig/PS4qP1tBLVpdKSg/PS4qP1thLXpdKSg/PS4qP1swLTldKS57OCx9JCc7XG59Il19