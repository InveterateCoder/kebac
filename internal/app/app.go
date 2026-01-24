package app

import (
	"context"
	"fmt"

	"github.com/InveterateCoder/kebac/internal/command"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() (*App, func(ctx context.Context)) {
	app := &App{}
	startup := func(ctx context.Context) {
		app.startup(ctx)
	}
	return app, startup
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetKubectlPath() string {
	path, err := command.Command.GetKubectlPath()
	if err != nil {
		return err.Error()
	}
	return path
}
