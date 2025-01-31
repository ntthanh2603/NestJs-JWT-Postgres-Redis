import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-sky-50">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng bạn</CardTitle>
          <CardDescription>Tạo tài khoản Social Space</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6 ">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label>*Họ và tên</Label>
                  <Input
                    id="username"
                    placeholder="Nhập họ và tên của bạn"
                    required
                    className="bg-sky-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>*Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    required
                    className="bg-sky-100"
                  />
                </div>
                <div className="grid gap-2 relative">
                  <div className="flex items-center">
                    <Label htmlFor="password">*Mật khẩu</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Nhập mật khẩu của bạn"
                      className="bg-sky-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Giới thiệu</Label>
                  <Input
                    id="bio"
                    placeholder="Nhập giới thiệu bản thân"
                    // required
                    className="bg-sky-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Website</Label>
                  <Input
                    id="website"
                    placeholder="Nhập URL website"
                    // required
                    className="bg-sky-100"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tuổi</Label>
                  <Input
                    id="age"
                    placeholder="Nhập tuổi của bạn"
                    // required
                    className="bg-sky-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Giới tính</Label>
                  <Input
                    id="gender"
                    placeholder="Nhập giới của bạn"
                    // required
                    className="bg-sky-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    id="address"
                    placeholder="Nhập địa chỉ của bạn"
                    // required
                    className="bg-sky-100"
                  />
                </div>

                {/* Checkbox Đồng ý tạo tài khoản mới */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(!!checked)}
                  />
                  <Label htmlFor="agreeToTerms">Đồng ý tạo tài khoản mới</Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sky-300"
                  disabled={!agreeToTerms} // Chỉ bật khi người dùng đồng ý
                >
                  Đăng ký
                </Button>
              </div>
              <div className="text-center text-sm">
                Bạn đã có tài khoản?{" "}
                <Link
                  href="/auth/login/"
                  className="underline underline-offset-4"
                >
                  Đăng nhập
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách nhấn đăng nhập, bạn đồng ý với chúng tôi{" "}
        <Link href="#">Điều khoản dịch vụ</Link> và{" "}
        <Link href="#">Chính sách bảo mật</Link>
      </div>
    </div>
  );
}
