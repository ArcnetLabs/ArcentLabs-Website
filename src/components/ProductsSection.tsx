import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Gamepad2, Route, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitToWaitlist } from "@/api/waitlist";

const products = [
  {
    id: "chessiq",
    icon: Gamepad2,
    name: "ChessIQ",
    tagline: "Chess Intelligence for Serious Players",
    description: "A consumer-facing chess intelligence product designed to help players analyze games, improve performance, and gain deeper insights into their play.",
    status: "In Development",
    statusColor: "bg-green-500/30 dark:text-green-300 text-green-700 border-green-400/50 dark:border-green-400/50 font-semibold",
    gradient: "from-neural/20 to-quantum/20",
    targetAudience: "Chess players seeking to improve their game"
  },
  {
    id: "journi",
    icon: Route,
    name: "Journi",
    tagline: "AI-Powered Journey Intelligence",
    description: "An AI-powered journey and workflow intelligence product focused on mapping, understanding, and optimizing user or business journeys.",
    status: "In Development",
    statusColor: "bg-green-500/30 dark:text-green-300 text-green-700 border-green-400/50 dark:border-green-400/50 font-semibold",
    gradient: "from-rose/20 to-neural/20",
    targetAudience: "Teams and businesses optimizing workflows"
  },
  {
    id: "scoutly",
    icon: Search,
    name: "Scoutly",
    tagline: "Prospect Intelligence Engine",
    description: "A prospect intelligence engine that searches the web for ideal clients, qualifies prospects, and automates personalized outreach.",
    status: "In Development",
    statusColor: "bg-green-500/30 dark:text-green-300 text-green-700 border-green-400/50 dark:border-green-400/50 font-semibold",
    gradient: "from-quantum/20 to-rose/20",
    targetAudience: "Sales and business development teams"
  }
];

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const product = products.find(p => p.id === selectedProduct);
    
    try {
      const success = await submitToWaitlist({
        product: product?.name || '',
        name,
        email,
        interest,
      });

      if (success) {
        toast({
          title: "Success! 🎉",
          description: `You've been added to the ${product?.name} waitlist. We'll notify you when it's ready!`,
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or contact us directly.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setSelectedProduct(null);
      setName("");
      setEmail("");
      setInterest("");
    }
  };

  const product = products.find(p => p.id === selectedProduct);

  return (
    <section id="products" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-neural/10 blur-[150px]" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-quantum/10 blur-[120px]" />
      
      <div className="container px-6 md:px-8" ref={ref}>
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="text-neural text-sm font-semibold tracking-widest uppercase mb-4 block">
              Our Products
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              AI Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building AI-powered products that help people work smarter, 
              make better decisions, and unlock new capabilities.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative card-glass rounded-2xl p-8 h-full hover-lift border border-transparent group-hover:border-neural/30 transition-all flex flex-col">
                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge className={product.statusColor}>
                      {product.status}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-background/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <product.icon className="w-7 h-7 text-neural" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-gradient-violet transition-all">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neural/80 mb-3 font-medium">
                    {product.tagline}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                    {product.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mb-6">
                    For: {product.targetAudience}
                  </p>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    className="w-full group/btn border-neural/30 hover:border-neural hover:bg-neural/10 text-foreground hover:text-foreground"
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>

                  {/* Hover Glow */}
                  <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neural to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Waitlist Dialog */}
      <Dialog open={selectedProduct !== null} onOpenChange={(open) => {
        if (!open) {
          setSelectedProduct(null);
          setName("");
          setEmail("");
          setInterest("");
        }
      }}>
        <DialogContent className="max-w-md border-neural/30 bg-background/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Join {product?.name} Waitlist
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Get early access to {product?.name.toLowerCase()} when it's ready. 
              We'll notify you as soon as it's available.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleWaitlistSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50 border-neural/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-neural/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest" className="text-foreground">
                Tell us about your interest (optional)
              </Label>
              <Textarea
                id="interest"
                placeholder="What are you most excited about?"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                rows={3}
                className="bg-background/50 border-neural/30"
              />
            </div>
            <Button
              type="submit"
              variant="hero"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProductsSection;
