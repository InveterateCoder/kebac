package app

import (
	"context"

	"github.com/InveterateCoder/kebac/internal/command"
)

type App struct {
	ctx context.Context
}

func NewApp() (*App, func(ctx context.Context)) {
	app := &App{}
	startup := func(ctx context.Context) {
		app.startup(ctx)
	}
	return app, startup
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) GetKubectlInfo() command.CommandInfo {
	return command.Cmd.GetInfo()
}
