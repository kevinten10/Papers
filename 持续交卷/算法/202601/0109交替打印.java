import java.util.concurrent.Semaphore;

class FooBar {

    int n;

    Semaphore fooSem = new Semaphore(1);

    Semaphore barSem = new Semaphore(0);

    FooBar(int n) {
        this.n = n;
    }

    void foo() {
        for (int i = 0; i < n; i++) {
            try {
                fooSem.acquire();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            System.out.println("foo");

            barSem.release();
        }
    }

    void bar() {
        for (int i = 0; i < n; i++) {
            try {
                barSem.acquire();
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            System.out.println("bar");

            fooSem.release();
        }
    }

    public static void main(String[] args) throws InterruptedException {
        FooBar fooBar = new FooBar(5);

        Thread fooThread = new Thread(() -> fooBar.foo());
        fooThread.start();

        Thread barThread = new Thread(() -> fooBar.bar());
        barThread.start();

        Thread.sleep(5000);
    }
}